<page>
    <actionBar title="Home" />
    <gridLayout padding="8" rows="*, auto" columns="*, auto">
        <scrollView class="scroll-view">
            <stackLayout>
                {#each heroList as hero}
                    <gridLayout class="rounded card">
                        <label class="text-xl align-middle text-center text-gray-500" text="{hero.name}" />
                        <button col="2" on:tap={() => deleteHero(hero)} class="button" text="delete"></button>
                        <button col="3" on:tap={() => updateHero(hero)} class="button" text="update"></button>
                    </gridLayout>
                {/each}
            </stackLayout>
        </scrollView>
        <button 
            row="2"
            col="2"
            class="button m-2 p-4 font-bold text-white rounded-full bg-blue-300"
            text="Add a new hero!"
            on:tap={() => addHero()}>
        </button>
    </gridLayout>
</page>

<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { tap } from 'rxjs';
    import { Dialogs } from '@nativescript/core';
    import { v4 } from '@herefishyfish/nativescript-rxdb';

    import { db, selectedHero } from '../core/store';

    let db$;
    let heroList = [];
    let sub;

    onMount(() => {
        console.log('onMount');
        const getHeroList = async () => {
            console.log('getting db');
            db$ = await db();
            console.log(db$)
            sub = db$.heroes
                .find()
                .$.subscribe((heroes) => (heroList = heroes));
        };
        getHeroList();
    });

    onDestroy(() => {
        console.log('onDestory');
        sub.unsubscribe();
    })

    const addHero = async (hero) => { 
        Dialogs.prompt('Enter hero name', '').then((response) => {
            if (response.result) {
                db$.heroes.insert({
                    id: v4(),
                    name: response.text,
                    color: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
            }
        });
    };
    const deleteHero = (hero) => { 
        Dialogs.confirm('Are you sure you would like to delete this hero?').then((result) => {
            if(result) {
                hero.remove();
            }
        })
    };
    const updateHero = (hero) => { 
        Dialogs.prompt('Change hero name', hero.name).then((promptResult) => {
        if (promptResult.result == true) {
            db$.heroes.upsert({
                id: hero.id,
                color: hero.color,
                name: promptResult.text,
                updatedAt: new Date().toISOString(),
                });
            }
        });
    };
</script>

<style>
    .scroll-view { 
        row-span: 2;
        col-span: 2;
    }

    .card {
        columns: auto, *, auto, auto;
        border-radius: 4;
        border-width: 1;
        border-color: #d3d3d4;
        padding: 10;
        height: 66;
        width: 100%;
        margin-bottom: 8;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    }

    .button {
        padding: 8;
        margin: 4;
        height: 60;
        box-shadow: 0;
        border-radius: 4;
        border-width: 1;
        border-color: #d3d3d4;
    }
</style>
